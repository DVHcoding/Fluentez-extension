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

export interface UserId {
    _id: string;
    username: string;
    photo: {
        public_id: string;
        url: string;
    };
    nickname: string;
    avatarFrame: {
        _id: string;
        photo: {
            public_id: string;
            url: string;
        };
    };
    level: number;
}

export interface VocabularyData {
    _id: string;
    title: string;
    userId: UserId;
    vocabularies: number;
    isPublic: boolean;
    isPremium: boolean;
}

export interface IGetVocabulariesByUserIdResponse {
    success: boolean;
    data: VocabularyData[];
    totalCount: number;
}

export interface VocabularyData {
    _id: string;
    title: string;
    userId: UserId;
    vocabularies: number;
    isPublic: boolean;
    isPremium: boolean;
}

export interface IUpdateQuickVocabularyPayload {
    vocabulary: {
        term: string;
        definition: string;
    };
    vocabularyId: string;
}
