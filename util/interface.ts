export interface User {
	display_name?: string;
	email?: string;
	password?: string;
	id?: number;
}

export interface Photo {
	id?: number;
	name?: string;
	user_id?: number;
}
