import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import './design-system.css'
import App from './App.jsx'
import { UserProvider } from './components/User/State/UserContext'
import "bootstrap/dist/css/bootstrap.min.css";
import { FamilyProvider } from './components/User/State/FamilyContext'
import { OtherInfoProvider } from './components/User/State/OtherInfoContext'
import { CountryProvider } from './components/User/State/CountryContext'
import { StateProvider } from './components/User/State/StateContext'
import { DistrictProvider } from './components/User/State/DistrictContext'
import { EducationProvider } from './components/User/State/EducationContext'
import { HeightProvider } from './components/User/State/HeightContext'
import { SubcastProvider } from './components/User/State/SubcastContext'
import { CastProvider } from './components/User/State/CastContext'
import { RashiProvider } from './components/User/State/RashiContext'
import { NakshtraProvider } from './components/User/State/NakshtraContext'
import { GanProvider } from './components/User/State/GanContext'
import { GotraProvider } from './components/User/State/GotraContext'
import { NadiProvider } from './components/User/State/NadiContext'
import { MarriageProvider } from './components/User/State/MarriageContext'
import { IncomeProvider } from './components/User/State/IncomeContext'
import { HeightBetweenProvider } from './components/User/State/HeightBetweenContext'
import { FilterProvider } from './components/User/State/FilterContext'
import { ColorProvider } from './components/User/State/ColorContext'
import { BloodProvider } from './components/User/State/BloodContext'
import { StoryProvider } from './components/User/State/StoryContext'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { TestimonialProvider } from './components/User/State/TestimonialContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CountryProvider>
      <StateProvider>
        <DistrictProvider>
          <EducationProvider>
            <HeightProvider>
            <HeightBetweenProvider> 
              <GanProvider>
                <NadiProvider>
                  <GotraProvider>
      <FamilyProvider> 
        <RashiProvider>
          <NakshtraProvider>
            <MarriageProvider> 
        <OtherInfoProvider>
          <SubcastProvider>
            <CastProvider>      
              <IncomeProvider>
              <UserProvider>
                <FilterProvider> 
                  <ColorProvider> 
                  <BloodProvider>
                    <StoryProvider>
                      <TestimonialProvider>
                      <App />
                      </TestimonialProvider>
                 
                    </StoryProvider>
       
        </BloodProvider>
        </ColorProvider>
        </FilterProvider>
        </UserProvider>
        </IncomeProvider>
        </CastProvider>
  
        </SubcastProvider>
        </OtherInfoProvider>
        </MarriageProvider>
        </NakshtraProvider>
        </RashiProvider>
      </FamilyProvider>
      </GotraProvider>
      </NadiProvider>

      </GanProvider>
      </HeightBetweenProvider>
      </HeightProvider>
      </EducationProvider>
      </DistrictProvider>
      </StateProvider>
      </CountryProvider>
   
  </StrictMode>,
)
