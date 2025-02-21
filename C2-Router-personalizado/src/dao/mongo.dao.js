export default class MongoDao {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        try {
            return this.model.find({});
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllFiltered(obj) {
        try {
            return this.model.find(obj.filter)
                .skip(obj.skip)
                .sort(obj.sortOption)
                .limit(obj.limitInt);
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(obj) {
        try {
            return this.model.create(obj);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async update(id, obj) {
        try {
            return await this.model.findByIdAndUpdate(id, obj, { new: true });
        } catch (error) {
            throw new Error(error);
        }
    }

    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async countDocuments(obj) {
        try {
            return await this.model.countDocuments(obj);
        } catch (e) {
            throw new Error(e);
        }
    }
}
