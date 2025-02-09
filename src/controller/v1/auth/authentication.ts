import httpStatus from 'http-status-codes';

import catchAsync from '@/utils/catchAsync';
import AuthenticatioAdminnService from '@/service/admin/authentication'

class AuthenticationController {
  static registerAdmin = catchAsync(async (req, res) => {
    const data = await AuthenticatioAdminnService.registerAdmin(req)
    res.status(httpStatus.OK).json(data)
  });
}

export default AuthenticationController;
