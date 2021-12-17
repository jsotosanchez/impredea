export const formatToContains = (string: string) => {
  return `%${string}%`;
};

export const formatToStartsWith = (string: string) => {
  return `${string}%`;
};


export const generateInsertProductsObject = (num: number, pid: number) => {
  let arr = [];
  for (let index = 0; index < num; index++) {
    arr.push({ productId: pid })
  }
  return arr
}