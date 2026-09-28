import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import App from './App.jsx'
import { CastProvider } from './Components/Admin/State/CastContext.jsx'
import { SubcastProvider } from './Components/Admin/State/SubcastContext.jsx'
import { GotraProvider } from './Components/Admin/State/GotraContext.jsx'
import { NadiProvider } from './Components/Admin/State/NadiContext.jsx'
import { NakshtraProvider } from './Components/Admin/State/NakshtraContext.jsx'
import { RashiProvider } from './Components/Admin/State/RashiContext.jsx'
import { GanProvider } from './Components/Admin/State/GanContext.jsx'
import { EducationProvider } from './Components/Admin/State/EducationContext.jsx'
import { HeightProvider } from './Components/Admin/State/HeightContext.jsx'
import { MarriageProvider } from './Components/Admin/State/MarriageContext.jsx'
import { CountryProvider } from './Components/Admin/State/CountryContext.jsx'
import { UserProvider } from './Components/Admin/State/UserContext.jsx'
import { StateProvider } from './Components/Admin/State/StateContext.jsx'
import { DistrictProvider } from './Components/Admin/State/DistrictContext.jsx'
import { FamilyProvider } from './Components/Admin/State/FamilyContext.jsx'
import { OtherInfoProvider } from './Components/Admin/State/OtherInfoContext.jsx'
import { IncomeProvider } from './Components/Admin/State/IncomeContext.jsx'
import { ColorProvider } from './Components/Admin/State/ColorContext.jsx'
import { BloodProvider } from './Components/Admin/State/BloodContext.jsx'
import { StoryProvider } from './Components/Admin/State/StoryContext.jsx'
import { TestimonialProvider } from './Components/Admin/State/TestimonialContext.jsx'
import { AboutProvider } from './Components/Admin/State/AboutContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CastProvider>
      <SubcastProvider>
        <GotraProvider>
          <NadiProvider>
            <NakshtraProvider>
              <RashiProvider>
                <GanProvider>
                  <EducationProvider>
                    <HeightProvider>
                      <MarriageProvider>
                        <IncomeProvider>
                        <CountryProvider>
                          <StateProvider> 
                            <DistrictProvider> 
                          <UserProvider>
                            <FamilyProvider>
                              <OtherInfoProvider>
                                <ColorProvider>
                                <BloodProvider>
                                  <StoryProvider>
                                    <TestimonialProvider>
                                      <AboutProvider>
                                      <App />
                                      </AboutProvider>
                                   
                                    </TestimonialProvider>
                             
                              </StoryProvider>
                              </BloodProvider>
                              </ColorProvider>
                              </OtherInfoProvider>
                            
                            </FamilyProvider>
                        
                          </UserProvider>
                          </DistrictProvider>
                          </StateProvider>
                                               </CountryProvider>
                                               </IncomeProvider>
              
               </MarriageProvider>
               </HeightProvider>
               </EducationProvider>
               </GanProvider>
               </RashiProvider>
               </NakshtraProvider>
       
        </NadiProvider>
        </GotraProvider>
        </SubcastProvider>
    
    </CastProvider>
  
  </StrictMode>,
)
