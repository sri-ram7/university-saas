module.exports = async (Model, id) => {
    return await Model.findByIdAndUpdate(
        id,
        {
            isDeleted: true,
            deletedAt: new Date(),
        },
        {
            new: true,
        }
    );
};