import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { HttpService, IServicesConfig } from '@services/http/http.service';
import { Observable, of, OperatorFunction, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { convertToModel } from '@misc/helpers/model-conversion/convert-to-model.function';
import { ClassConstructor } from 'class-transformer';
import { List } from '@models/classes/_list.model';
import { get } from 'lodash';

/** Usage example
 *  For list:
 *    this._apiService
 *     .getItems()
 *     .pipe(
 *       this._apiService.preloadFieldsInList([
 *         { field: '<field-name>', model: <class-constructor> },
 *         ...
 *       ])
 *     )
 *     .subscribe();
 *
 *  For single item:
 *    this._apiService
 *     .getItem()
 *     .pipe(
 *       this._apiService.preloadFieldsInModel([
 *         { field: '<field-name>', model: <class-constructor> },
 *         ...
 *       ])
 *     )
 *     .subscribe();
 */

interface IFieldToPreload {
  field: string;
  model: ClassConstructor<any>;
}

@Injectable({
  providedIn: 'root'
})
export abstract class ApiPreloadHelperAbstractService {
  protected readonly LIST_PRELOAD_ROOT: string = '/hydra:member/*/';
  protected readonly PRELOADS: string[] = [];

  protected constructor(@Inject(APP_CONFIG) protected config: IAppConfig, protected http: HttpService) {}

  get listPreloads(): string[] {
    return this.PRELOADS.map((part: string): string => `${this.LIST_PRELOAD_ROOT}${part}`);
  }

  preloadFieldsInModel<EntityModel, PreloadedModel>(
    fields: IFieldToPreload[],
    servicesConfig?: IServicesConfig
  ): OperatorFunction<EntityModel, EntityModel> {
    const preloads: OperatorFunction<EntityModel, EntityModel>[] = fields.map(
      ({ field, model }: IFieldToPreload): OperatorFunction<EntityModel, EntityModel> => {
        return this._preloadFieldInItem<EntityModel, EntityModel>(field, model, servicesConfig);
      }
    );
    return (input$: Observable<EntityModel>): Observable<EntityModel> => input$.pipe.apply(input$, preloads);
  }

  preloadFieldsInList<EntityModel, PreloadedModel>(
    fields: IFieldToPreload[],
    servicesConfig?: IServicesConfig
  ): OperatorFunction<List<EntityModel>, List<EntityModel>> {
    const preloads: OperatorFunction<List<EntityModel>, List<EntityModel>>[] = fields.map(
      ({ field, model }: IFieldToPreload): OperatorFunction<List<EntityModel>, List<EntityModel>> => {
        return this._preloadFieldInListItems<EntityModel, EntityModel>(field, model, servicesConfig);
      }
    );
    return (input$: Observable<List<EntityModel>>): Observable<List<EntityModel>> => input$.pipe.apply(input$, preloads);
  }

  private _preloadFieldInItem<EntityModel, PreloadedModel>(
    fieldPath: string,
    preloadedModel: ClassConstructor<PreloadedModel>,
    servicesConfig?: IServicesConfig
  ): OperatorFunction<EntityModel, EntityModel> {
    return (input$: Observable<EntityModel>): Observable<EntityModel> =>
      input$.pipe(
        switchMap((entity: EntityModel): Observable<[EntityModel, PreloadedModel]> => {
          const link: string = get(entity, fieldPath);
          return zip(of(entity), link ? this._getSubResource<PreloadedModel>(link, servicesConfig) : of(null));
        }),
        map(([entity, preloadedItem]: [EntityModel, PreloadedModel]): EntityModel => {
          return this._updateModel(fieldPath, entity, preloadedItem, preloadedModel);
        })
      );
  }

  private _preloadFieldInListItems<EntityModel, PreloadedModel>(
    fieldPath: string,
    preloadedModel: ClassConstructor<PreloadedModel>,
    servicesConfig?: IServicesConfig
  ): OperatorFunction<List<EntityModel>, List<EntityModel>> {
    return (input$: Observable<List<EntityModel>>): Observable<List<EntityModel>> =>
      input$.pipe(
        switchMap((list: List<EntityModel>): Observable<[PreloadedModel[], List<EntityModel>]> => {
          const preloadsList: string[] = Array.from(
            new Set<string>(list.entities.map((entity: EntityModel): string => get(entity, fieldPath)))
          );

          return zip<[PreloadedModel[], List<EntityModel>]>(
            list.entities.length
              ? zip<PreloadedModel[]>(
                  ...preloadsList.map((link: string): Observable<PreloadedModel> => {
                    return link ? this._getSubResource<PreloadedModel>(link, servicesConfig) : of(null);
                  })
                )
              : of([]),
            of(list)
          );
        }),
        map(([preloadedItems, list]: [PreloadedModel[], List<EntityModel>]): List<EntityModel> => {
          list.entities.map((entity: EntityModel): EntityModel => {
            const preloaded: PreloadedModel = preloadedItems.find((preloadedItem: PreloadedModel & { id: string }): boolean =>
              get(entity, fieldPath)?.includes(preloadedItem?.id)
            );

            return this._updateModel(fieldPath, entity, preloaded, preloadedModel);
          });

          return list;
        })
      );
  }

  private _getSubResource<R>(iri: string, servicesConfig?: IServicesConfig): Observable<R> {
    return this.http.get(`${this.config.apiUrl}${iri}`, {}, servicesConfig);
  }

  private _updateModel<EntityModel, PreloadedModel>(
    fieldPath: string,
    entity: EntityModel,
    preloaded: PreloadedModel,
    preloadedModel: ClassConstructor<PreloadedModel>
  ): EntityModel {
    if (fieldPath.includes('.')) {
      const upLevelPath: string = fieldPath.replace(/\.\w*$/, '');
      const lastLevelPathPart: string = fieldPath.split('.').reverse()[0];
      const modelToUpdate: string = get(entity, upLevelPath);

      modelToUpdate[lastLevelPathPart] = preloaded ? convertToModel(preloaded, preloadedModel) : modelToUpdate[lastLevelPathPart];
    } else {
      entity[fieldPath] = preloaded ? convertToModel(preloaded, preloadedModel) : entity[fieldPath];
    }

    return entity;
  }
}
