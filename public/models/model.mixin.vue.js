const ModelMixin = {
    methods: {
        getCollection(collectionName) {
            return DB.collection(collectionName);
        },
        getRef(id, collectionName) {
            return this.getCollection(collectionName).doc(id);
        },
        bind(id, collectionName, varName) {
            return typeof id === "object" ? this.bindByRef(id, varName) : this.bindById(id, collectionName, varName);
        },
        bindById(id, collectionName, varName) {
            return this.$bind(varName, this.getRef(id, collectionName), {reset: false});
        },
        bindByRef(ref, varName) {
            return this.$bind(varName, ref, {reset: false});
        },
        bindCollection(collectionName, filters, varName) {
            let collection = this.getCollection(collectionName);
            if (filters) {
                filters.forEach(filter => {
                    collection = collection.where(filter[0], filter[1], filter[2]);
                });
            }
            return this.$bind(varName, collection);
        },
        async get(id, collectionName) {
            const item = await this.getRef(id, collectionName).get();
            let data = {};
            if(item.exists) {
                data = item.data();
                data.id = id;
            }
            return data;
        },
        async create(data, collectionName) {
            const res = await this.getCollection(collectionName).add(data);
            // this.$root.showToast(_.capitalize(collectionName) +" created", "success");
            return res;
        },
        async update(id, data, collectionName, merge=true) {
            const res = await this.getRef(id, collectionName).set(data, {merge: merge});
            // this.$root.showToast(_.capitalize(collectionName) + " updated", "success");
            return res;
        },
        async remove(id, collectionName) {
            const res = await this.getRef(id, collectionName).delete();
            // this.$root.showToast(_.capitalize(collectionName) + " deleted", "success");
            return res;
        },
    }
};
