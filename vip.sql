DROP TABLE public.pets 			CASCADE;
DROP TABLE public.preferences 		CASCADE;
DROP TABLE public.employment 		CASCADE;
DROP TABLE public.family 			CASCADE;
DROP TABLE public.contact 			CASCADE;
DROP TABLE public.vip 				CASCADE;
DROP TABLE public.vipuser 			CASCADE;
DROP TABLE public.session 			CASCADE;

CREATE TABLE public.vipuser
(id SERIAL PRIMARY KEY NOT NULL,
 username 		VARCHAR(30) NOT NULL UNIQUE,
 password 		TEXT NOT NULL UNIQUE,
 first_name 	VARCHAR(30) NOT NULL,
 last_name 		VARCHAR(40) NOT NULL);

CREATE TABLE public.vip
(id SERIAL PRIMARY KEY NOT NULL,
 vip_user_id 	INTEGER REFERENCES public.vipuser(id) ON DELETE CASCADE,
 first_name 	VARCHAR(30) NOT NULL,
 middle_name 	VARCHAR(30),
 last_name 		VARCHAR(40) NOT NULL,
 dob 			DATE,
 wedding_anniv 	DATE);

CREATE TABLE public.contact
(id 			SERIAL PRIMARY KEY NOT NULL,
 vip_id 		INTEGER REFERENCES public.vip(id) ON DELETE CASCADE,
 vip_user_id 	INTEGER REFERENCES public.vipuser(id) ON DELETE CASCADE,
 phone 			VARCHAR(50),
 phoneType 		VARCHAR(3),
 email 			TEXT,
 address1 		TEXT,
 address2 		TEXT,
 city 			TEXT,
 state 			TEXT,
 zip 			INTEGER,
 country 		TEXT
 CONSTRAINT chk_ids CHECK ((vip_id IS NULL) != (vip_user_id IS NULL)));

CREATE TABLE public.family
(id SERIAL PRIMARY KEY NOT NULL,
 vip_id 		INTEGER REFERENCES public.vip(id) ON DELETE CASCADE,
 first_name 	VARCHAR(30) NOT NULL,
 middle_name 	VARCHAR(30),
 last_name 		VARCHAR(40),
 relationship 	VARCHAR(20),
 dob 			DATE);
 
CREATE TABLE public.employment
(id SERIAL PRIMARY KEY NOT NULL,
 vip_id 		INTEGER REFERENCES public.vip(id) ON DELETE CASCADE,
 employer_name 	VARCHAR(100),
 work_anniv 	DATE,
 title 			VARCHAR(30),
 job_desc 		TEXT,
 manager 		VARCHAR(100));

CREATE TABLE public.preferences
(id SERIAL PRIMARY KEY NOT NULL,
 vip_id 		INTEGER REFERENCES public.vip(id) ON DELETE CASCADE,
 fav_color 		VARCHAR(20),
 fav_sport 		VARCHAR(50),
 fav_team 		VARCHAR(50),
 fav_restuarant VARCHAR(100),
 fav_music 		VARCHAR(100),
 fav_tv_show 	VARCHAR(100));

CREATE TABLE public.pets
(id SERIAL PRIMARY KEY NOT NULL,
 vip_id 		INTEGER REFERENCES public.vip(id) ON DELETE CASCADE,
 name 			VARCHAR(50),
 type 			VARCHAR(20),
 dob 			DATE,
 fav_treat 		VARCHAR(50));

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


INSERT INTO vip(vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv) VALUES ('1', 'Charlie', 'Block Head', 'Brown', '1960-06-01', '1981-07-23');
INSERT INTO vip(vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv) VALUES ('2', 'Susan', 'Marie', 'Black', '1980-06-01', '2001-07-23');