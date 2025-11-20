const Manual = require('../models/Manual');

exports.getManual = async (req, res) => {
  try {
    let manual = await Manual.findOne();
    
    // If no manual exists, create one with empty content
    if (!manual) {
      manual = await Manual.create({ 
        content: '',
        lastUpdated: new Date(),
      });
    }
    
    res.json({ manual });
  } catch (error) {
    console.error('Error fetching manual:', error);
    res.status(500).json({ message: 'Unable to fetch manual', error: error.message });
  }
};

exports.updateManual = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (content === undefined) {
      return res.status(400).json({ message: 'Content is required' });
    }

    let manual = await Manual.findOne();
    
    if (!manual) {
      manual = await Manual.create({ 
        content,
        updatedBy: req.user.id,
        lastUpdated: new Date(),
      });
    } else {
      manual.content = content;
      manual.updatedBy = req.user.id;
      manual.lastUpdated = new Date();
      await manual.save();
    }

    res.json({ 
      message: 'Manual updated successfully',
      manual 
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update manual', error: error.message });
  }
};

