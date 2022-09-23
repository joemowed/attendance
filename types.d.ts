declare global 
{interface attendanceUser {
    photoURL: string;
    displayName: string;
    email:string;
    emailVerified: boolean;
    uid: string;
    created_UNIX_MILLIS: number; 
}
}