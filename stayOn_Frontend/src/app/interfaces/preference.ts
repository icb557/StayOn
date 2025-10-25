export interface UserPreferences {
    userId: number;
    Topic?: {
        id: number;
        name: string;
    }[];
    // Alternative formats that might be returned by the API
    topics?: {
        id: number;
        name: string;
    }[];
    preferences?: {
        topicId: number;
        userId: number;
        Topic?: {
            id: number;
            name: string;
        };
    }[];
} 

export interface Preference {
    topicId: number;
    userId: number;
}