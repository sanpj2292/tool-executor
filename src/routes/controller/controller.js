const router = new require('express').Router();

const { downloadService, toolService } = require('../service/');

router.get('/', (req, res) => {
    const { ipInfo } = req;
    console.log(`Browsing from ${ipInfo.city}, ${ipInfo.country}`)
    res.send('Express App is Functional');
});

router.use('/download', downloadService);
router.use('/service', toolService);

module.exports = router;