const s = (a = 3) => {
  let t = "";
  try {
    throw new Error();
  } catch (c) {
    t = (c.stack || "").match(/\s\((.*?)\)\s/g)[a].replaceAll("\\", "/").match(/.*\/(.*?)\)\s$/)[1];
  }
  return `${t}  `;
};
export {
  s as default
};
