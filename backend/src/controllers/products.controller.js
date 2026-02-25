import Products from '../models/products.model.js'
import Business from '../models/business.model.js'

const addProducts = async (req,res)=>{
 const {productName, description, costPrice,sellingPrice, quantity } = req.body
 const userId = req.user.id

 // Find the user's business
    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }
    const calculatedprofit = (sellingPrice - costPrice)
 try {
   const products  = await Products.create({
    productName,
    description, 
    costPrice, 
    sellingPrice,
    quantity,
    profit: calculatedprofit,
    businessId: business.id
  })
 res.status(200).json(products)  
 } catch (error) {
    console.log(error)
 }
}

//find all Productss
const findAllProducts = async (req, res) => {
 try {
 const products = await Products.findAll()
 res.status(200).json({ products })
 } catch (error) {
 console.log(error)
 res.status(500).json({error: 'Failed to retrieve Productss'})
 }
}
 
//delete Products by id
const deleteProducts = async (req, res) => {
 try {
 const {id} = req.params
 await Products.destroy({where:{id}})
 res.status(200).json({message: 'Products  deleted successfully'})
 } catch (error) {
 console.log(error)
 res.status(500).json({error: 'Failed to delete Products '})
 }
}
 
export {addProducts, findAllProducts, deleteProducts}
 


 