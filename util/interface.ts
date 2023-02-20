export interface User {
	display_name?: string;
	email?: string;
	password?: string;
	id?: number;
}
export interface GoogleUser {
	id: string;
	email: string;
	verified_email: Boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}
