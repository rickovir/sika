import { extname } from "path";

export const reduceObject = (data, arrReduce:string[]) =>{
    return Object.keys(data).reduce((object, key) => {
        if (!arrReduce.includes(key)) {
          object[key] = data[key]
        }
        return object
      }, {});
}

export const clearResult = (data:Object)=>{
    return reduceObject(data,['isDeleted']);
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  String.prototype
  let name:string = file.originalname.split('.')[0];
  name = name.replace(/\W/g, '');
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const toSQLDate = (strDate:string) =>{
  const newDate = new Date(strDate);
  return newDate.toISOString().slice(0, 19).replace('T', ' ');
}