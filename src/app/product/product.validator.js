const {z} = require('zod');
// category ["ids", "ids"]
// form Data => ["ids","ids"] -> "ids,ids"
// controller => db insert 
const ProductValidatorSchema = z.object({
    title: z.string().min(2),
    summary: z.string().nullable(),
    description: z.string().nullable(), 
    category: z.string().nullable(),    // ids,
    price: z.string().regex(/^\d+$/).min(1),
    discount: z.string().regex(/^\d+$/).min(0).max(99).nullable(), 
    brand: z.string().nullable(),
    attributes: z.array(z.object({
        key: z.string(),
        value:z.array(z.string())
    })).nullable(),
    tag: z.string().nullable(),
    sellerId: z.string().nullable(),
    status: z.string().regex(/active|inactive/).default('inactive')
})

module.exports = {ProductValidatorSchema}