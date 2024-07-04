# Sistem Pakar Rekomendasi Karir Menggunakan Algoritma Dempster Shafer

## Alur API

1. User login with google, dan sistem mendapatkan data berikut ([POST] hit endpoint /auth/login):

   a. id

   b. email

2. User input data profile:

   a. umur

   Notes:

   - [PUT] hit endpoint /users/update

3. Jika belum pernah input data hardskill, atau ingin input data hardskill baru:

   1. User pilih skill berdasarkan data yg disediakan sistem (dari endpoint /skill-availables)
   2. masukan brp waktu (dalam bulan) pengalaman dlm menguasai skill itu

   Notes:

   - bisa diinput berkali kali
   - [POST] hit endpoint /skill-experiences dengan payload

     - skill_availables_id: diambil dari id salah satu data endpoint /skill-availables

     - month_of_experience: angka

4.
