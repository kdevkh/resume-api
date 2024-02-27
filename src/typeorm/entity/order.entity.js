const EntitySchema = require('typeorm').EntitySchema

const STATUS = {
    ORDER_WAITIED: 'ORDER_WAITING',
    ORDER_PREPARING: 'ORDER_PREPARING',
    DELIVERY_STARTED: 'DELIVERY_STARTED',
    DELIVERY_COMPLETED: 'DELIVERY_COMPLETED',
}

module.exports = new EntitySchema({
    name: 'Order',
    tableName: 'Orders',
    columns: {
        orderId: {
            primary: true,
            type: 'int',
            generated: true,
        },
        userId: {
            type: 'int',
        },
        storeId: {
            type: 'int',
        },
        menuId: {
            type: 'int',
        },
        status: {
            type: 'enum',
            enum: STATUS,
        },
        location: {
            type: 'varchar',
        },
        amount: {
            type: 'int',
        },
        field: {
            type: 'varchar',
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
    },
    relations: {
        user: {
            target: 'Users',
            type: 'many-to-one',
            joinTable: true,
            joinColumn: { name: 'userId' },
            cascade: true,
        },

        store: {
            target: 'Stores',
            type: 'many-to-one',
            joinTable: true,
            joinColumn: { name: 'storeId' },
            cascade: true,
        },

        menu: {
            target: 'menu',
            type: 'many-to-one',
            joinTable: true,
            joinColumn: { name: 'menuId' },
            cascade: true,
        },
    },
})
