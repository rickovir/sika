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