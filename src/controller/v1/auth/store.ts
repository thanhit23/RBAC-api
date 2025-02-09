import httpStatus from 'http-status-codes';

import Users from "@/model/Users";
import StoreService from '@/service/admin/store';
import catchAsync from '@/utils/catchAsync';

class StoreController {
  static getStores = catchAsync(async (_, res) => {
    const data = await StoreService.getStores()
    res.status(httpStatus.OK).json(data)
  });

  static createStore = catchAsync(async (req, res) => {
    const data = await StoreService.createStore(req.body)
    res.status(httpStatus.CREATED).json(data)
  });

  static updateStore = catchAsync(async (req, res) => {
    const data = await StoreService.updateStore((req?.user as Users)?.id! as number, { ...req.body, ...req.params })
    res.status(httpStatus.OK).json(data)
  });

  static deleteStore = catchAsync(async (req, res) => {
    const data = await StoreService.deleteStore((req?.user as Users)?.id! as number, +req.params.id)
    res.status(httpStatus.OK).json(data)
  });
}

export default StoreController;
