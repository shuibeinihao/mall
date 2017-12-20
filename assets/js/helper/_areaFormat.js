const areaFormat = (province, city, district) => {
  if (!province || !city || !district) return '';

  let pcd = `${province}-${city}-${district}`;
  if (pcd.length > 15) {
    pcd = '...' + pcd.substr(-15);
  }

  return pcd;
};

export default areaFormat;
