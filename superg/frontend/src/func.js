export function normalize_coords(x, y) {
  const bound_rect = document.getElementById("graph_container").getBoundingClientRect();
  const width = bound_rect.width;
  const height = bound_rect.height;
  let norm_x, norm_y;
  if(width > height) {
    norm_x = (x-(width-height)/2)/height;
    norm_y = y/height;
  } else {
    norm_x = x/width;
    norm_y = (y-(height-width)/2)/width;
  }
  return {x: norm_x, y: norm_y}
}

export function denormalize_coords(x, y) {
  const bound_rect = document.getElementById("graph_container").getBoundingClientRect();
  const width = bound_rect.width;
  const height = bound_rect.height;
  let denorm_x, denorm_y;
  if(width > height) {
    denorm_x = x*height+(width-height)/2;
    denorm_y = y*height;
  } else {
    denorm_x = x*width;
    denorm_y = y*width+(height-width)/2;
  }
  /*console.log(x+" "+y)
  console.log(width+" "+height)
  console.log({x: denorm_x, y: denorm_y})*/
  return {x: denorm_x, y: denorm_y}
}