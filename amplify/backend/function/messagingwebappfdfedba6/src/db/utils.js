exports.tryAddCountryCode = (phone) => {
  if (phone.length === 10) return `+91${phone}`;
  if (phone.length === 12) return `+${phone}`;
  if (phone.length === 13) return phone;
  console.trace(
    "cannot add country code, received invalid value for required parameter phone."
  );
  return phone;
};

exports.andConcatFilterExpression = (fx1, fx2) => {
  if (!fx1) return fx2;
  if (!fx2) return fx1;
  return `${fx1} AND ${fx2}`;
};
