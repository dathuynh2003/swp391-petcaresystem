import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='container '  >
      {/* <div className='row my-5 mx-5 w-75 rounded' style={{ height: '550px', position: 'absolute', zIndex: 0, backgroundColor: '#007DDE' }}>
        <div className='col-7 m-auto w-25 h-50 text-white text-center' style={{}}>
          <h1 className='fs-1 fw-semibold mb-0' >We Care</h1>
          <b className='fs-1 fw-bold'>Your Pets</b>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          <Link className='btn btn-light my-4 rounded-pill w-100 h-25 fs-5 fw-normal pt-3' to={'/booking'}>Book Appointment</Link>
        </div>
        <div className='col-5 mx-auto h-100 w-50' style={{ position: 'relative' }}>
          <img className='h-100' style={{ marginTop: '17%', minWidth: '120%' }} src="https://scontent.fsgn2-10.fna.fbcdn.net/v/t1.15752-9/441600025_381293664921454_2664090812178932537_n.png?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEUHAy7VM5YedjGJ3geL8FMpP0903d4D46k_T3Td3gPjrpsKJQwnhYAAth-REaW1uQ6BS1bP0yS_HWsw2KEv5lU&_nc_ohc=OFAFE4IunuEQ7kNvgEF1xQg&_nc_ht=scontent.fsgn2-10.fna&oh=03_Q7cD1QF_oxU7hweY3fBmayPBlS1ZVWZdW91XpynyZRJ-Y4zFFw&oe=6688D4BC" alt="DOG" />
        </div>

      </div> */}
      <div style={{ width: '100%' }} >
        <Carousel style={{ marginRight: '3%', marginTop: '4%' }}>
          <Carousel.Item style={{ width: '100%' }} className='mx-auto' >
            <img
              className="d-block w-100" style={{ height: '580px', width: '100%' }}
              src="https://wallpaperaccess.com/full/497354.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item style={{ width: '100%' }} >
            <img
              className="d-block w-100" style={{ height: '580px', width: '100%' }}
              src="https://nordic.allianzgi.com/-/media/allianzgi/eu/regional-content/images/pets/1920x980-tiergesundheit.jpg?rev=-1"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item style={{ width: '100%' }}>
            <img
              className="d-block w-100" style={{ height: '580px', width: '100%' }}
              src="https://images2.alphacoders.com/110/1108403.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>











  );
};

export default Home;
