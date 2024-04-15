import { defineStore } from 'pinia';
import axios from 'axios';
import { authStore } from './authStore';

export const pageAccessStore = defineStore('pageAccessStore', {
    state: () => ({
        taskNames: null
    }),
    actions: {
        async getTaskNames() {
            const store = authStore();
            try {
                await axios
                    .get('http://localhost:5000/api/taskName', {
                        headers: {
                            Authorization: `Bearer ${store.accessToken}`
                        }
                    })
                    .then((res) => {
                        this.taskNames = res.data.taskName;
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                console.log(error);
            }
        }
    }
});
