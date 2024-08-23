interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  headPic: string;
  createTime: Date;
}

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
