export const getDate = (date) => {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", {
    month: "short",
  });
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  return `${year}. ${month} ${day}.`;
};

export const humanReadableByte = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(0) + byteUnits[i];
};
