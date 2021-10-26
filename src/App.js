import React,{useEffect,useState} from 'react';
import './App.css';
import CovidSummary from './components/CovidSummary';
import LineGraph from './components/LineGraph';
import axios from './axios';
//import NumberFormat from 'react-number-format';

//React bootstrap imports
import {Navbar,Nav,Carousel,Card,Container,Row,Col,Button,Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
 //states declaration
  const [totalConfirmed ,setTotalConfirmed]= useState(0);
  const [totalRecovered,setTotalRecovered]= useState(0);
  const [totalDeaths ,setTotalDeaths]= useState(0);
  const [loading,setLoading]=useState(false);
  const [covidSummary,setCovidSummary] = useState({});
  const[days,setDays]= useState(7);
  const[country,setCountry]= useState('');
  const[coronaCountAr,setCoronaCountAr]=useState([]);
  const[label,setLabel]=useState([]);

  //Component Didmount
   useEffect(() => {
      
    setLoading(true);
     axios.get('/summary')
     .then(res=>{
       setLoading(false);
       if(res.status === 200){
         setTotalConfirmed(res.data.Global.TotalConfirmed);
         setTotalRecovered(res.data.Global.TotalRecovered);
         setTotalDeaths(res.data.Global.TotalDeaths);
         setCovidSummary(res.data);
       }
       console.log(res);
     })
     .catch(error=>{
       console.log(error);
     })



  }, []);

const formatDate = (date) =>{
  const d = new Date(date);
  const year =d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = d.getDate();
  return `${year}-${month}-${_date}`;
}

const countryHandler =(e)=>{
  setCountry(e.target.value);
  const d= new Date();
  const to = formatDate(d);
  const from = formatDate(d.setDate(d.getDate() -days));

  //console.log(from ,to);
  getCoronaReportByDateRange(e.target.value ,from ,to);
}
 const daysHandler = (e) => {
   setDays(e.target.value);
   const d= new Date();
   const to = formatDate(d);
   const from = formatDate(d.setDate(d.getDate() -e.target.value));
   getCoronaReportByDateRange(country ,from ,to);
 }

 const getCoronaReportByDateRange = (countrySlug ,from ,to) => {
     
     axios.get(`/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
        .then(res =>{
          console.log(res);

        const yAxisCoronaCount = res.data.map(d => d.Cases);
        const xAxisLabel =res.data.map(d => d.Date);
        const covidDetails = covidSummary.Countries.find(country => country.Slug === countrySlug);

        setCoronaCountAr(yAxisCoronaCount);
        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeaths(covidDetails.TotalDeaths);
        setLabel(xAxisLabel);

        }) 
        .catch(error =>{
          console.log(error);
        })

 }

if(loading){
  return <p>Fetching the data,Please Wait......!</p>
}

  return (
    <div className="App">
  <div>
  <Navbar bg="light" variant="light">
    <Navbar.Brand href="#home">Covid-19</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#carousels">Awareness</Nav.Link>
      <Nav.Link href="https://www.mohfw.gov.in/covid_vaccination/vaccination/faqs.html#vaccine-registration">FAQ</Nav.Link>
      <Nav.Link href="#vaccine">Vaccination</Nav.Link>
      <Nav.Link href="https://www.mohfw.gov.in/pdf/StatewiseCovidHospitalslink19062020.pdf">Facilities</Nav.Link>
      <Nav.Link href="#symptom">Symptoms</Nav.Link>
      <Nav.Link href="#support">Support</Nav.Link>
    </Nav>
    <Image className="img-head" src="https://www.cdc.gov/coronavirus/2019-ncov/images/site-banner/cases_rising_banner_1200x250_v5.png"></Image>
  </Navbar>
  <div id="start">
    <Image className="img-first" src="https://www.mohfw.gov.in/covid_vaccination/vaccination/dist/images/banner-2.png"></Image>
  </div>
  </div>
     <CovidSummary 
       totalConfirmed={totalConfirmed}
       totalRecovered={totalRecovered}
       totalDeaths={totalDeaths}
       country={country}
     />

    <div>
      <select value={country} onChange={countryHandler}>
      <option value="">Select Country</option>
          {
            covidSummary.Countries && covidSummary.Countries.map(country =>
            <option key={country.Slug} value={country.Slug}>
               {country.Country}
            </option>
            )
          }
      </select>
      <select value={days} onChange={daysHandler}>
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last 90 Days</option>

      </select>
    </div>
    <section id="graph">
    <LineGraph
       yAxis= {coronaCountAr}
       label={label}
     />
    </section>
    
    <div>
    <marquee behavior="scroll" direction="left" onmouseover="this.stop();" onmouseout="this.start();"><span class="tested">Total number of tests done during the previous day 14,73,210</span></marquee>
    <span class="blinking bar" style={{display: "inline;"}}>For any technical enquiry with respect to COVID-19, you may kindly email on
     <strong>
     <a href="mailto:technicalquery.covid19@gov.in"> : technicalquery.covid19@gov.in</a>
     </strong>
</span>
    <br></br>
      <a href="https://www.mohfw.gov.in/pdf/AAROGYASETUIVRS1921.pdf" target="_BLANK" class="pl-80">
      Aarogya Setu IVRS 1921</a>
    </div>
<br></br>
<section id="carousels">
<h1  style={{textAlign:'center',padding:'2%',opacity:'80%'}}>Awareness</h1>
<Carousel>
  <Carousel.Item>
    <img
      className="car-img"
      src="https://nhm.gov.in/images/coronavirus/cv2.jpg"
      alt="First slide"
    />
    
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="car-img"
      src="https://i0.wp.com/yubanet.com/wp-content/uploads/2020/07/COVID-Face-Coverings-Flyer_Page_1-scaled.jpg?ssl=1"
      alt="Second slide"
    />

   
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="car-img"
      src="https://cdn.s3waas.gov.in/s385422afb467e9456013a2a51d4dff702/uploads/2020/03/2020032111.jpeg"
      alt="Third slide"
    />

   
  </Carousel.Item>
</Carousel>
</section>

<section id="vaccine">
<h1  style={{textAlign:'center',marginTop:'2%',opacity:'80%'}}>Vaccination</h1>
  <Container>
    <Row>
      <Col fluid className="card-faq">
      <Card  style={{ width: '18rem' }}>
  <Card.Img variant="top" src="https://www.health.gov.au/sites/default/files/images/publications/2021/03/covid-19-vaccine-eligibility-checker.png" />
  <Card.Body>
    <Card.Title>Get Vaccination</Card.Title>
    <Card.Text>
      Register Yourself for the vaccination
    </Card.Text>
    <Button href="https://www.cowin.gov.in/home" variant="primary">Register</Button>
  </Card.Body>
</Card>
      </Col>
      <Col  fluid className="card-faq">
      <Card  style={{ width: '18rem' }}>
  <Card.Img variant="top" src="https://www.health.gov.au/sites/default/files/images/publications/2021/03/covid-19-vaccine-eligibility-checker.png" />
  <Card.Body>
    <Card.Title>Vaccination centers</Card.Title>
    <Card.Text>
      Check to see vaccination centers near you
    </Card.Text>
    <Button href="https://www.google.com/search?safe=active&sa=X&rlz=1C1NDCM_enIN820IN820&tbs=lf:1&tbm=lcl&sxsrf=ALeKk031pGMeQUaGZtymU9LGKELBH2Cl7w:1618603221286&q=vaccination+centres+near+me&rflfq=1&num=10&ved=2ahUKEwjP06XwxoPwAhVozTgGHUiEC3gQjGp6BAgGECE&cshid=1618603258886679&biw=1536&bih=754#rlfi=hd:;si:;mv:[[19.33435034143366,73.3189994194336],[19.1207214132887,72.93585122607422],null,[19.227570603342745,73.12742532275391],12]" variant="primary">Check</Button>
  </Card.Body>
</Card>
      </Col>
      <Col  fluid className="card-faq">
      <Card  style={{ width: '18rem' }}>
  <Card.Img variant="top" src="https://www.health.gov.au/sites/default/files/images/publications/2021/03/covid-19-vaccine-eligibility-checker.png" />
  <Card.Body>
    <Card.Title>Common side effects</Card.Title>
    <Card.Text>
      Know the common side effects of the vaccine
    </Card.Text>
    <Button href="https://www.mohfw.gov.in/covid_vaccination/vaccination/common-side-effects-aefi.html" variant="primary">Effects</Button>
  </Card.Body>
</Card>
      </Col>
    </Row>
  </Container>
</section>


<div className='public-symptoms' id="symptom"> 
<h1>Symptoms</h1>
<div>
<Row>
<Col className="col-s1">


<p>People with COVID-19 have had a wide range of symptoms reported – ranging from mild symptoms to severe illness. Symptoms may appear 
<strong>2-14 days after exposure</strong>
 <strong>to the virus.</strong>
  People with these symptoms may have COVID-19:
  </p>
  </Col>
  <Col className='col-s2'>
  <ul className="fir-ul">
<li>Fever or chills</li>
<li>Cough</li>
<li>Shortness of breath or difficulty breathing</li>
<li>Fatigue</li>
<li>Muscle or body aches</li>
<li>Headache</li>
<li>New loss of taste or smell</li>
<li>Sore throat</li>
<li>Congestion or runny nose</li>
<li>Nausea or vomiting</li>
<li>Diarrhea</li>
</ul>
  </Col>
</Row>



</div>
</div>



<br></br>
<br></br>
<section id="support" >
<footer>
  <div class="container">
    <div class="row">
      <div class="col-md-4 footer-column">
       
         
          <span class="copyright quick-links">Copyright &copy; Prathamesh Barve <script>document.write(new Date().getFullYear())</script>
        </span>
       
      </div>
     
      <div class="col-md-4 footer-column">
        <ul class="nav flex-column">
          <li class="nav-item">
            <span class="footer-title">Contact & Support</span>
          </li>
          <li class="nav-item">
            <span class="nav-link"><i class="fas fa-phone"></i>Helpline Number :+91-11-23978046</span>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://www.mohfw.gov.in/pdf/StatewiseCovidHospitalslink19062020.pdf"><i class="fas fa-comments"></i>Covid-19 facilities in States & Union Territories</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fas fa-envelope"></i>Helpline Email ID : ncov2019@gov.in</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="fas fa-star"></i>Toll Free : 1075</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="text-center"><i class="fas fa-ellipsis-h"></i></div>
    
    <div class="row text-center">
      <div class="col-md-4 box">
       
      </div>
      <div class="col-md-4 box">
        <ul class="list-inline social-buttons">
          <li class="list-inline-item">
            <a href="#">
            <i class="fab fa-twitter"></i>
          </a>
          </li>
          <li class="list-inline-item">
            <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          </li>
          <li class="list-inline-item">
            <a href="#">
            <i class="fab fa-linkedin-in"></i>
          </a>
          </li>
        </ul>
      </div>
      <div class="col-md-4 box">
        <ul class="list-inline quick-links">
          <li class="list-inline-item">
            <a href="#">Privacy Policy</a>
          </li>
          <li class="list-inline-item">
            <a href="#">Terms of Use</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
</section>

    </div>
  );
}

export default App;
