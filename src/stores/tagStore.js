import { defineStore } from 'pinia';
import axios from 'axios';
import { authStore } from './authStore';

export const tagStore = defineStore('tagStore', {
    state: () => ({
        tags: null,
        message: null
    }),
    actions: {
        async getPasiens() {
            const store = authStore();
            try {
                await axios
                    .get('http://localhost:5000/api/pasien', {
                        // headers: {
                        //     Authorization: `Bearer ${store.accessToken}`
                        // }
                    })
                    .then((res) => {
                        console.log(res);
                        this.tags = res.data.pasiens;
                        console.log(res);
                        console.log(this.tags.length);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                console.log(error);
            }
        },
        async addPasien(nama, no_hp, jenis_pasien) {
            const store = authStore();

            const params = new URLSearchParams();
            params.append('nama', nama);
            params.append('no_hp', no_hp);
            params.append('jenis_pasien', jenis_pasien);

            try {
                await axios
                    .post('http://localhost:5000/api/pasien', params)
                    .then((res) => {
                        // this.tags = res.data.tags;
                        this.getPasiens();
                        console.log(res);
                    })
                    .catch((err) => {
                        throw err;
                    });
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        async deleteTag(idTag) {
            const store = authStore();

            try {
                await axios
                    .delete(`http://localhost:5000/api/pasien/${idTag}`, {
                        headers: {
                            Authorization: `Bearer ${store.accessToken}`
                        }
                    })
                    .then((res) => {
                        // this.tags = res.data.tags;
                        this.getPasiens();
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                console.log(error);
            }
        },
        async deletePasienMany(ids) {
            const store = authStore();

            const params = new URLSearchParams();
            params.append('ids', ids);
            try {
                await axios
                    .delete(`http://localhost:5000/api/pasien`, params)
                    .then((res) => {
                        // this.tags = res.data.tags;
                        this.getPasiens();
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                console.log(error);
            }
        },
        async updatePasien(idTag, name, no_hp, jenis_pasien) {
            const store = authStore();

            const params = new URLSearchParams();
            params.append('nama', name);
            params.append('no_hp', no_hp);
            params.append('jenis_pasien', jenis_pasien);

            try {
                await axios
                    .put(`http://localhost:5000/api/pasien/${idTag}`, params)
                    .then((res) => {
                        // this.tags = res.data.tags;
                        this.getPasiens();
                        console.log(res);
                    })
                    .catch((err) => {
                        throw err;
                    });
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        test() {
            console.log('test');
        }
    }
});
