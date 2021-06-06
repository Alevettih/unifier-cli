import { Player } from '@models/classes/player.model';

export function getUserValue(fromValue: any): Partial<Player> {
  return {
    ...fromValue
  };
}
