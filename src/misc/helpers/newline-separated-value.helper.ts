export const newlineSeparatedValue = {
  stringify(data: object = {}): string {
    const resArr = [];

    Object.keys(data).forEach((key: string): void => {
      if (key !== '_' && !resArr.includes(`\n# ${key}`)) {
        resArr.push(`\n# ${key}`);
      }

      data[key].forEach((value: string): void => {
        resArr.push(value);
      });
    });

    return [...new Set(resArr)].join('\n').trim();
  },
  parse(data: string = ''): object {
    const dataArr: string[] = data.split('\n');
    const res: object = {};

    let key = '_';

    dataArr.forEach((value: string): void => {
      if (!value) {
        return;
      }

      if (!res[key]) {
        res[key] = [];
      }

      if (value.includes('#')) {
        key = value.replace('# ', '');
      } else {
        res[key].push(value);
      }
    });

    return res;
  }
};
