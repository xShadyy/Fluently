import React from 'react';
import { IconCheck } from '@tabler/icons-react';
import {
  Button,
  Container,
  Group,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
  Paper,
  useMantineTheme,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import image from '../../../../public/images/materials.svg';
import classes from './Materials.module.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

interface CardProps {
  image: string;
  title: string;
  category: string;
}

function Card({ image, title, category }: CardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.carouselCard}
    >
      <div>
        <Text className={classes.carouselCategory} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.carouselTitle}>
          {title}
        </Title>
      </div>
      <Button variant="white" color="dark">
        Read Article
      </Button>
    </Paper>
  );
}

const carouselData = [
  {
    image:
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Master English Vocabulary',
    category: 'Vocabulary',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Essential Grammar Tips',
    category: 'Grammar',
  },
  {
    image:
      'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Pronunciation Practice',
    category: 'Pronunciation',
  },
  {
    image:
      'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Effective Writing Skills',
    category: 'Writing',
  },
  {
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Listening Comprehension Strategies',
    category: 'Listening',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    title: 'Speaking Confidence Tips',
    category: 'Speaking',
  },
];

export function Materials() {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const slides = carouselData.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <div>
      {/* Hero Header Section */}
      <Container size="md">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Unlock Your <span className={classes.highlight}>English Potential</span>
            </Title>
            <Text color="dimmed" mt="md">
              Discover a wealth of learning materials designed to enhance your English skills—from vocabulary and grammar to listening, speaking, and writing.
            </Text>
            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Interactive Lessons</b> – engaging content to boost your learning.
              </List.Item>
              <List.Item>
                <b>Expert Tips</b> – practical strategies from seasoned educators.
              </List.Item>
              <List.Item>
                <b>Flexible Learning</b> – access high-quality materials anytime, anywhere.
              </List.Item>
            </List>
            <Group mt={30}>
              <Button radius="xl" size="md" className={classes.control}>
                Start Learning
              </Button>
              <Button variant="default" radius="xl" size="md" className={classes.control}>
                Explore More
              </Button>
            </Group>
          </div>
          <Image src={image.src} className={classes.image} />
        </div>
      </Container>

      {/* Carousel Section */}
      <Container className={classes.carouselContainer}>
        <Title order={2} ta="center" mb="md">
          Featured English Learning Resources
        </Title>
        <Carousel
          slideSize={{ base: '100%', sm: '50%' }}
          slideGap={{ base: 2, sm: 'xl' }}
          align="start"
          slidesToScroll={mobile ? 1 : 2}
        >
          {slides}
        </Carousel>
      </Container>
    </div>
  );
}
