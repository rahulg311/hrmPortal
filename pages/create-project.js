import React from 'react'

const createProject = () => {
  return (
    <div class="container">
  <div class="panel panel-default">
    <div class="panel-body">

      <div class="stepper">
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active">
            <a class="persistant-disabled" href="#stepper-step-1" data-toggle="tab" aria-controls="stepper-step-1" role="tab" title="Step 1">
              <span class="round-tab">1</span>
            </a>
          </li>
          <li role="presentation" class="disabled">
            <a class="persistant-disabled" href="#stepper-step-2" data-toggle="tab" aria-controls="stepper-step-2" role="tab" title="Step 2">
              <span class="round-tab">2</span>
            </a>
          </li>
          <li role="presentation" class="disabled">
            <a class="persistant-disabled" href="#stepper-step-3" data-toggle="tab" aria-controls="stepper-step-3" role="tab" title="Step 3">
              <span class="round-tab">3</span>
            </a>
          </li>
          <li role="presentation" class="disabled">
            <a class="persistant-disabled" href="#stepper-step-4" data-toggle="tab" aria-controls="stepper-step-4" role="tab" title="Complete">
              <span class="round-tab">4</span>
            </a>
          </li>
        </ul>
        <form role="form">
          <div class="tab-content">
            <div class="tab-pane fade in active" role="tabpanel" id="stepper-step-1">
              <h3 class ="h2">1. Select Payment Type</h3>
              <p>This is step 1</p>
              <ul class="list-inline pull-right">
                <li>
                  <a class="btn btn-primary next-step">Next</a>
                </li>
              </ul>
            </div>
            <div class="tab-pane fade" role="tabpanel" id="stepper-step-2">
              <h3 class ="h2">2. Enter Payment Information</h3>
              <p>This is step 2</p>
              <ul class="list-inline pull-right">
                <li>
                  <a class="btn btn-default prev-step">Back</a>
                </li>
                <li>
                  <a class="btn btn-primary next-step">Next</a>
                </li>
              </ul>
            </div>
            <div class="tab-pane fade" role="tabpanel" id="stepper-step-3">
              <h3 class="hs">3. Review and Submit Payment</h3>
              <p>This is step 3</p>
              <ul class="list-inline pull-right">
                <li>
                  <a class="btn btn-default prev-step">Back</a>
                </li>
                <li>
                  <a class="btn btn-default cancel-stepper">Cancel Payment</a>
                </li>
                <li>
                  <a class="btn btn-primary next-step">Submit Payment</a>
                </li>
              </ul>
            </div>
            <div class="tab-pane fade" role="tabpanel" id="stepper-step-4">
              <h3>4. All done!</h3>
              <p>You have successfully completed all steps.</p>
            </div>
          </div>
        </form>
      </div>


    </div>
  </div>
</div>
  )
}

export default createProject