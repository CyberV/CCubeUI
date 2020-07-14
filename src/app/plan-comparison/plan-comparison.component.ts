import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'plan-comparison',
  templateUrl: './plan-comparison.component.html',
  styleUrls: ['./plan-comparison.component.scss'],
})
export class PlanComparisonComponent implements OnInit {

  featureCodes:any;
  planNames:any;
  planList: any;
  featureList: any;
  constructor() {

    
    this.planNames = ['What you get', 'Standard', 'Deluxe', 'Elite'];

    this.planList = [
      {
        name: 'Standard',
        features:[ "DISINFECT_INT", "WASH_WATER", "CLEAN_OUT", "RUST_OUT", "CLEAN_INT", "WINDSHLD_OUT", "AIR_CHECK",  "CLEAN_BOOT"  ]
      },
      {
        name: 'Deluxe',
        features:[ "DISINFECT_INT", "WASH_WATER", "CLEAN_OUT", "RUST_OUT", "CLEAN_INT", "WINDSHLD_OUT", "AIR_CHECK", "OIL_CHECK", "CLEAN_BOOT", "WASH_DEEP" ]
      },
      {
        name: 'Elite',
        features:[ "DISINFECT_INT", "WASH_WATER", "CLEAN_OUT", "RUST_OUT", "CLEAN_INT", "WINDSHLD_OUT", "AIR_CHECK", "OIL_CHECK", "CLEAN_BOOT", "WNDSHLD_INT", "POLISH_TYRE", "CLEAN_DOOR", "NEW_FRAG", "WASH_DEEP", "BATTERY_CHECK" ]
      }
    ];

    this.featureList = [
      {
          name: "Internal Disinfectation",
          description: "Disinfectation of seats, dashboard, steering wheel, gear stick, hand break, door sides, handles and roof for the safety of your loved ones",
          frequency: "Twice a week",
          code: "DISINFECT_INT"
      },
      {
          name: "Water Efficient Washing",
          description: "proper upper body wash, tyres, headlights and rubber mats with water to make it shine like a star",
          frequency: "Twice a week",
          code: "WASH_WATER"
      },
      {
          name: "Upper body Microfibre Cloth Cleaning",
          description: "complete upper body cleaning with a microfibre cloth so dust wont settle on your car even for 1 day",
          frequency: "Daily",
          code: "CLEAN_OUT"
      },
      {
          name: "Rust Protection",
          description: "application of a chemical layer to help reducing rust occurance so your car never gets old",
          frequency: "Twice a week",
          code: "RUST_OUT"
      },
      {
          name: "Internal cleaning",
          description: "complete cleaning of all the surfaces inside, seats, dashboard, steering wheel so you feel like a king on a throne",
          frequency: "Twice a week",
          code: "CLEAN_INT"
      },
      {
          name: "Windshield Cleaning - Outside",
          description: "Proper upper body wash, tyres, headlights and rubber mats with water to make it shine like a star",
          frequency: "Daily",
          code: "WINDSHLD_OUT"
      },
      {
          name: "Air Pressure Monitoring and Refilling",
          description: "checking and refilling of air pressure for your tension free safe journey along with long happy running tyres",
          frequency: "Once a week",
          code: "AIR_CHECK"
      },
      {
        name: "Boot Cleaning",
        description: "cleaning the boot space so even your luggage feel the cleanliness and luxury",
        frequency: "Twice a week",
        code: "CLEAN_BOOT"
    },
    {
        name: "Deep Wash in a Shop",
        description: "get a much required deep wash in a washing centre with complete internal and external cleaning with internal polish",
        frequency: "Once a month",
        code: "WASH_DEEP"
    },
      {
          name: "Engine Oil and Coolant checking",
          description: "checking engine oil and coolant once in 15 days to let know that you are good to go",
          frequency: "Twice a month",
          code: "OIL_CHECK"
      },

      {
          name: "Windshield Care - Inside",
          description: "using special chemicals to clean your windshield inside out for a spotless view  and long life of the special glass",
          frequency: "Once a week",
          code: "WNDSHLD_INT"
      },
      {
          name: "Tyre Polish",
          description: "polishing the black beauties so it compliments your chariot along with those shining alloys",
          frequency: "Once a week",
          code: "POLISH_TYRE"
      },
      {
          name: "Door Rubber Cleaning",
          description: "cleaning of those tight rubber gullys on doors for a less noisy cabin with a premium feel",
          frequency: "Once a week",
          code: "CLEAN_DOOR"
      },
      {
          name: "New Fragrance",
          description: "Select a new fragrance every week from a wide range of our special scents",
          frequency: "Twice a month",
          code: "NEW_FRAG"
      },
      {
          name: "Battery Check",
          description: "Checking that current giving source for its health through an ammeter so it sparks whenever you need",
          frequency: "Twice a month",
          code: "BATTERY_CHECK"
      }
  ];

  this.featureCodes = this.featureList.map( (feature) => feature.code);


   }

  

  ngOnInit() {}

}
