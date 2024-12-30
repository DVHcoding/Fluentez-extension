export interface APIResponse {
    success: boolean;
    message?: string;
    user: UserDetailsType;
}

export interface UserDetailsType {
    _id: string;
    nickname: string;
    username: string;
    email: string;
    photo: {
        public_id: string;
        url: string;
    };
    roles?: string;
    createdAt: Date;
    followers: string[];
    following: string[];
    friends: string[];
    level: number;
    isPremium: boolean;
    isBlock: boolean;
    avatarFrame?: IAvatarFrame | null;
}

interface IAvatarFrame {
    _id: string;
    photo: {
        public_id: string;
        url: string;
    };
    name: string;
    expiryType: string;
    expiryDate: Date;
    owner: string;
    createdAt: Date;
}
