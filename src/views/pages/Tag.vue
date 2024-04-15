<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

import { tagStore } from './../../stores/tagStore';
const store = tagStore();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const updateProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const loading = ref(false);
const loadingData = ref(true);
const message = ref();
const filters = ref({});
const submitted = ref(false);
const jenisPasien_selected = ref(null)
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const productService = new ProductService();

const jenis_pasien = [
    { label: 'Umum', value: 'umum' },
    { label: 'BPJS', value: 'bpjs' },
    { label: 'Asuransi', value: 'asuransi' }
];

const getJenisPasien = (label) => {
    return { label: label, value: label };
};

// Get Tags
const getPasiens = async () => {
    await store.getPasiens();
    loadingData.value = false;
    message.value = await store.message;
    console.log(message.value);
};

// Add Tags
const addPasien = async (nama, no_hp, jenis_pasien) => {
    console.log(nama, no_hp, jenis_pasien.label);
    loading.value = true;
    try {
        await store.addPasien(nama, no_hp, jenis_pasien.label);
        await toast.add({ severity: 'success', summary: 'Congratulations!', detail: `${nama} has been added!`, life: 3000 });
        await getPasiens();
        productDialog.value = false;
    } catch (error) {
        // console.log(error);
        await toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.data.message, life: 3000 });
    }
    loading.value = false;
};

// Delete Tag
const deleteTag = async (data) => {
    console.log(data)
    loading.value = true;
    await store.deletePasienMany(data);
    await getPasiens();
    deleteProductDialog.value = false;
    await toast.add({ severity: 'success', summary: 'Congratulations!', detail: `${name} has been deleted!`, life: 3000 });
    loading.value = false;
};

// Delete Many Tag
const deleteTagMany = async () => {
    loading.value = true;
    try {
        const selectedTag = selectedProducts.value;
        selectedTag.forEach(async (tag) => {
            await store.deleteTag(tag._id);
            await getPasiens();
        });

        deleteProductsDialog.value = false;
        await toast.add({ severity: 'success', summary: 'Congratulations!', detail: `Selected Tag has been deleted!`, life: 3000 });
    } catch (error) {
        await toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.message, life: 3000 });
    }
    loading.value = false;
    // get selected tag
};

// Update Tag
const updatePasien = async (id, name, no_hp, jenis_pasien) => {
    loading.value = true;
    try {
        await store.updatePasien(id, name, no_hp, jenis_pasien.label);
        await toast.add({ severity: 'success', summary: 'Congratulations!', detail: `${name} has been updated!`, life: 3000 });
        await getPasiens();
        updateProductDialog.value = false;
    } catch (error) {
        await toast.add({ severity: 'error', summary: 'Error Message', detail: error.response.data.message || `${name} has been exist`, life: 3000 });
    }
    loading.value = false;
};

// noColumn
const noColumn = (rowData, column) => {
    const rowIndex = store.tags.indexOf(rowData);
    return rowIndex + 1;
};

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    await getPasiens();
    console.log(message.value);
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    updateProductDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    updateProductDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <span class="block p-1 text-5xl text-black-alpha-90">Pasien</span>
                            <span class="block p-1 lb-desc">View all pasien</span>
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="my-2">
                            <Button label="Add New Tag" icon="pi pi-plus" class="mr-2 p-button-success" @click="openNew" />
                            <Button label="Delete Tag" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>
                </Toolbar>

                <Skeleton width="100%" height="150px" v-if="loadingData"></Skeleton>

                <DataTable
                    v-else-if="store.tags && store.tags.length > 0 && !loadingData"
                    class="p-datatable-gridlines p-datatable-lg"
                    ref="dt"
                    :value="store.tags"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 25, 50]"
                    :globalFilterFields="['namaTag']"
                    :filters="filters"
                    :selection="selectedProducts"
                    @selectionChange="selectedProducts = $event.value"
                    :rowHover="true"
                    v-model:selection="selectedProducts"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll"
                >
                    <template #empty>
                        <div class="text-center">
                            <span class="p-ml-2">No results found.</span>
                        </div>
                    </template>
                    <template #header>
                        <div class="flex mb-5 bg-white flex-column">
                            <span class="mb-2">Search By Keyword : </span>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>
                    <Column selectionMode="multiple" style="width: 3rem" />
                    <Column field="nama" header="Nama" sortable />
                    <Column field="no_hp" header="No Hp" sortable />
                    <Column field="jenis_pasien" header="Jenis Pasien" sortable />
                    <Column header="Action" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button label="Edit" icon="pi pi-pencil" class="mr-2 p-button-rounded p-button-warning" @click="editProduct(slotProps.data)" />
                            <Button label="Delete" icon="pi pi-trash" class="mt-2 p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <div class="text-center card" v-else>
                    <h1>{{ store.message }}</h1>
                </div>

                <Dialog :closable="false" v-model:visible="productDialog" :style="{ width: '450px' }" header="Tambah Pasien" :modal="true" class="p-fluid">
                    <Toast />
                    <div class="mt-3 field">
                        <label for="description">Nama</label>
                        <InputText type="text" v-model="product.nama" />
                    </div>
                    <div class="mt-3 field">
                        <label for="description">No. Hp</label>
                        <InputNumber type="text" v-model="product.no_hp" :useGrouping="false" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Jenis Pasien </label>
                        <!-- dropdown-->
                        <Dropdown v-model="product.jenis_pasien" :disabled="store.loading" :loading="store.loading" :options="jenis_pasien" optionLabel="label" :placeholder="store.loading ? 'Loading . . .' : 'Select a Category'" />
                    </div>
                    <template #footer>
                        <Button label="Cancel" v-if="loading" disabled icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Cancel" v-else icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Tambah Pasien" v-if="product.nama && product.no_hp && product.jenis_pasien" :loading="loading" icon="pi pi-check" class="p-button-text" @click="addPasien(product.nama, product.no_hp, product.jenis_pasien)" />
                        <Button label="Tambah Pasien" v-else disabled :loading="loading" icon="pi pi-check" class="p-button-text" />
                    </template>
                </Dialog>

                <Dialog :closable="false" v-model:visible="updateProductDialog" :style="{ width: '450px' }" header="Edit Pasien" :modal="true" class="p-fluid">
                    <div class="mt-3 field">
                        <label for="description">Nama</label>
                        <InputText type="text" v-model="product.nama" />
                    </div>
                    <div class="mt-3 field">
                        <label for="description">No. Hp</label>
                        <InputNumber type="text" v-model="product.no_hp" :useGrouping="false" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Jenis Pasien </label>
                        <!-- dropdown-->
                        <Dropdown v-model="jenisPasien_selected" :disabled="store.loading" :loading="store.loading" :options="jenis_pasien" optionLabel="label" :placeholder="store.loading ? 'Loading . . .' : 'Select a Category'" />
                    </div>
                    <template #footer>
                        <Button v-if="loading" disabled label="Cancel" icon="pi pi-times" class="p-button-text" />
                        <Button v-else label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button v-if="product.nama && product.no_hp && jenisPasien_selected" label="Update" :loading="loading" icon="pi pi-check" class="p-button-text" @click="updatePasien(product._id, product.nama, product.no_hp, jenisPasien_selected)" />
                        <Button v-else label="Update" icon="pi pi-check" class="p-button-text" disabled />
                    </template>
                </Dialog>

                <Dialog :closable="false" v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.nama }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button :loading="loading" label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteTag(product._id)" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="mr-3 pi pi-exclamation-triangle" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button v-if="loading" disabled label="No" icon="pi pi-times" class="p-button-text" />
                        <Button v-else label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" :loading="loading" icon="pi pi-check" class="p-button-text" @click="deleteTagMany" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style>
.p-datatable.p-datatable-lg .p-datatable-header {
    padding: 0 !important;
}

.p-datatable .p-datatable-header {
    background-color: white !important;
    border: 0px solid tranpsarent;
}
</style>
