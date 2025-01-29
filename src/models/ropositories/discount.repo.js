'use strict';

const { find } = require("lodash");
const { getSelectData, unGetSelectData } = require("../../utils");
const {

} = require("../../utils/httpStatusCode")


const findAllDiscountCodeUnSelect = async(limit = 50, page = 1, sort = 'ctime', filter, unSelect, model) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ?{_id: -1} : {_id: 1}
  const documents = await model.find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(unGetSelectData(select))
  .lean()

  return products
}

const findAllDiscountCodeSelect = async(limit = 50, page = 1, sort = 'ctime', filter, select, model) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ?{_id: -1} : {_id: 1}
  const documents = await model.find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(getSelectData(select))
  .lean()

  return products
}

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect
}