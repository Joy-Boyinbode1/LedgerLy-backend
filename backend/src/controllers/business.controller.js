 import Business from '../models/business.model.js'

const addBusiness = async (req,res)=>{
 const {fullName, phoneNumber, businessName, businessType} = req.body
 const userId = req.user.id
 
 // Validate required fields
 if (!fullName || !phoneNumber || !businessName || !businessType) {
   return res.status(400).json({ message: 'All fields (fullName, phoneNumber, businessName, businessType) are required' })
 }
 
 // Validate phone number format (numbers and + only)
 const phoneRegex = /^[0-9+]+$/;
 if (!phoneRegex.test(phoneNumber)) {
   return res.status(400).json({ message: 'Phone number must contain only numbers and + symbol' })
 }
 
 try {
   const userbusiness = await Business.create({
    fullName, phoneNumber, businessName, businessType, userId
   })
   console.log('Business created:', { businessId: userbusiness.id, userId, businessName });
   res.status(201).json({
     message: 'Business created successfully',
     ...userbusiness.toJSON()
   })  
 } catch (error) {
    console.error('addBusiness error:', error);
    res.status(500).json({ message: 'Failed to create business' })
 }
}

//find all Businesss
const findAllBusiness = async (req, res) => {
 try {
 const userbusiness = await Business.findAll()
 res.status(200).json({ message: 'Businesses retrieved successfully', userbusiness })
 } catch (error) {
 console.error('findAllBusiness error:', error)
 res.status(500).json({message: 'Failed to retrieve Businesses'})
 }
}
 
//delete Business by id
const deleteBusiness = async (req, res) => {
 try {
 const {id} = req.params
 await Business.destroy({where:{id}})
 res.status(200).json({message: 'Business deleted successfully'})
 } catch (error) {
 console.error('deleteBusiness error:', error)
 res.status(500).json({message: 'Failed to delete Business'})
 }
}

// Update Business by id (PUT)
const updateBusiness = async (req, res) => {
  try {
    const { fullName, phoneNumber, businessName, businessType } = req.body;

    // Ensure the user can only update their own business
    const business = await Business.findOne({ where: { userId: req.user.id } });

    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }

    await business.update({
      fullName: fullName || business.fullName,
      phoneNumber: phoneNumber || business.phoneNumber,
      businessName: businessName || business.businessName,
      businessType: businessType || business.businessType
    });

    console.log('Business updated:', { businessId: business.id, userId: req.user.id });
    res.status(200).json({ 
      message: 'Business updated successfully',
      ...business.toJSON() 
    });
  } catch (error) {
    console.error('updateBusiness error:', error);
    res.status(500).json({ message: 'Failed to update business' });
  }
};

 
export {addBusiness, findAllBusiness, deleteBusiness, updateBusiness}
 


 