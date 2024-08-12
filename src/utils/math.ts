export const round = (value: any, fixedNumber: number = 7) => {
  const num = Number(value);
  return (
    Math.floor((num + Number.EPSILON) * +`1e${fixedNumber}`) /
    +`1e${fixedNumber}`
  );
};

export const roundUp = (value: any, fixedNumber: number = 7) => {
  fixedNumber = Math.pow(10, fixedNumber);
  return Math.ceil(value * fixedNumber) / fixedNumber;
};

export const sixthRound = (value: any) => {
  const num = Number(value);
  return Math.floor((num + Number.EPSILON) * 1e6) / 1e6;
};

export const percentRound = (value: any) => {
  const num = Number(value);
  return Math.floor((num + Number.EPSILON) * 1e2) / 1e2;
};

export const removeExponents = (number: any) => {
  var data = String(number).split(/[eE]/);
  if (data.length == 1) return data[0];

  var z = "",
    sign = number < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

export const getTwoDemical = (number: any) => {
  return Number.isInteger(number) ? number : number.toFixed(2);
};

export const countDecimals = function (number: any): number {
  if (Math.floor(number) === number) return 0;
  return removeExponents(number).toString().split(".")[1].length || 0;
};
