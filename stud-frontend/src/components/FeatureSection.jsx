import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';

import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import WifiIcon from '@mui/icons-material/Wifi';
import CoffeMakerIcon from '@mui/icons-material/CoffeeMaker';
import ChairIcon from '@mui/icons-material/Chair';

const features = [
    {
        icon: <SelfImprovementIcon sx={{ fontSize: 50}} />,
        title: '조용한 학습 공간',
        description: '최고의 집중력을 위한 독립된 공간과 방음 설계',
    },
    {
        icon: <WifiIcon sx={{ fontSize: 50}} />,
        title: '초고속 와이파이',
        description: '끊김 없는 와이파이로 원활한 인강 수강',
    },
    {
        icon: <CoffeeMakerIcon sx={{ fontSize: 50}}/>,
        title: '프리미엄 음료',
        description: '프리미엄 커피메이커로 만들어진 커피 맛',
    },
    {
        icon: <ChairIcon sx={{fontSize: 50}}/>,
        title: '다양한 좌석',
        description: '개인용 부스부터 개방형 테이블, 소파 좌석까지',
    },
];


function FeatureSection(){
    return (
        <Box sx={{ py: 8, backgroundColor: '#f9fafb'}}>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" sx={{ fontWeight: 'bold'}} gutterBottom>스터디카페 특징</Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6}}>
                 최적의 학습 경험을 위해 준비된 특별한 서비스
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature) => (
                        <Grid item xs={12} sx={6} md={3} key={feature.title}>
                            <Paper elevation={0} sx={{ textAlign: 'center', p: 4, borderRadius: 2}}>
                                <Box color="primary.main" mb={2}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" sx={{fontWeight: 'bold'}} gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default FeatureSection;