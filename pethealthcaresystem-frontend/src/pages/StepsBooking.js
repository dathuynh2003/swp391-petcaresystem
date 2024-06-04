import React, { useState } from 'react';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@chakra-ui/react';
export default function StepsBooking() {
  const [step, setStep] = useState(2);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };
  switch (step) {
    case 1:
      return (
        <div>
          <ul>
            <li>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label class="form-label" for="inlineCheckbox1">
                  PET HAHAHA
                </label>
              </div>
              <div>
                <button onClick={handleNextStep} className="btn btn-outline-primary" type="submit">
                  Tiếp theo
                </button>
              </div>
            </li>
          </ul>
        </div>
      );
    case 2:
      return (
        <div>
          <ul>
            <li>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                <label class="form-label" for="inlineCheckbox1">
                  PET control
                </label>
              </div>
              <div>
                <button onClick={handlePrevStep} className="btn btn-outline-primary" type="submit">
                  Quay lại
                </button>
                <button onClick={handleNextStep} className="btn btn-outline-primary" type="submit">
                  Tiếp theo
                </button>
              </div>
            </li>
          </ul>

          <Tabs>
            <TabList>
              <Tab>Choose Pet</Tab>
              <Tab>Reason</Tab>
              <Tab>Time</Tab>
              <Tab>Payment</Tab>
              <Tab>Get Ready</Tab>
              <Tab>Consult</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ul className="list-group">
                  <li className="list-group-item">
                    <div className="form-check form-switch">
                      <input
                        // value={pet.isNeutered}
                        // onChange={(e) => setPet((prev) => ({ ...prev, isNeutered: e.target.checked }))}
                        name="pet"
                        className="form-check-input"
                        type="radio"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        required
                      />
                      <label className="form-check-label" for="flexSwitchCheckDefault">
                        HUHU
                      </label>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="form-check form-switch">
                      <input
                        name="pet"
                        // value={pet.isNeutered}
                        // onChange={(e) => setPet((prev) => ({ ...prev, isNeutered: e.target.checked }))}
                        className="form-check-input"
                        type="radio"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        required
                      />
                      <label className="form-check-label" for="flexSwitchCheckDefault">
                        HUHU
                      </label>
                    </div>
                  </li>
                </ul>
              </TabPanel>
              <TabPanel>
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                  ></textarea>
                  <label for="floatingTextarea2">Comments</label>
                </div>
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      );
  }
}
