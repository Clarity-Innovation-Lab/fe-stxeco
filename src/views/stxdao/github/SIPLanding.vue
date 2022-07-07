<template>
<section>
  <b-container class="my-5">
    <b-row>
      <b-col>
        <h1>SIP: Stacks Improvement Proposals</h1>
        <p>Suggestion for the content here</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :cardContent="votingCard" :path="'/stxdao/sip-voting'" label="More About Voting" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :cardContent="cabsCard" :path="'/stxdao/sip-cabs'" label="About the CABs" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :cardContent="suggestionsCard" :path="'/stxdao/sip-issues'" label="Make a Suggestion?" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :cardContent="proposalsCard" :path="'/stxdao/sip-issues?filter=pulls'" label="SIP Proposals" />
      </b-col>
      <b-col md="6" sm="6" class="my-2">
        <StxEcoDisplayCard :cardContent="processCard" :path="'/stxdao/sip-process'" label="Read More.." />
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import StxEcoDisplayCard from './DisplayCard'

export default {
  name: 'SIPLanding',
  components: {
    StxEcoDisplayCard
  },
  data: function () {
    return {
      bgImage1: require('@/assets/img/thinker.jpg'),
      bgImage2: require('@/assets/img/membership.jpg'),
      bgImage3: require('@/assets/img/vote.jpg'),
      bgImage4: require('@/assets/img/seats.jpg'),
      processCard: '<h1>SIP Process</h1><p>nice diagrams and explanations</p>' +
                      '<p>emphasise process is on GitHub - explain why!</p>' +
                      '<ol>' +
                      '<li>describe how to create a sip</li>' +
                      '<li>diagrams of SIP workflow</li>' +
                      '<li>define the CABs diagrams</li>' +
                      '</ol>',
      cabsCard: '<h1>SIP CABs</h1>' +
                      '<p>About CABs - Advisory Boards!</p>' +
                      '<ol>' +
                      '<li>Goverance - join discussions</li>' +
                      '<li>Tokenomics - join discussions</li>' +
                      '<li>Technical - join discussions</li>' +
                      '</ol>',
      votingCard: '<h1>Activating SIPs</h1>' +
                      '<p>getting the community involved via the DAO</p>' +
                      '<ol>' +
                      '<li>Activate SIP becomes a DAO Proposal</li>' +
                      '<li>Rules of the DAO apply - e.g.</li>' +
                      '<li>Voting starts in 1 day / ends in 1 week</li>' +
                      '</ol>',
      suggestionsCard: '<h1>SIP Suggestions</h1>' +
                      '<p>SIPs start out as suggestions or issues registered on GitHub</p>' +
                      '<ol>' +
                      '<li>GitHub is complicated - learn about why we use it.</li>' +
                      '<li>Have a suggestion for improving Stacks?</li>' +
                      '<li>Comment on someone else\'s suggestion?</li>' +
                      '</ol>',
      proposalsCard: '<h1>SIP Proposals</h1>' +
                      '<p>Once reviewd a suggestion becomes a proposal (aka a Pull Request in GitHub lingo)</p>' +
                      '<ol>' +
                      '<li>SIP workflow.</li>' +
                      '<li>Review open proposals</li>' +
                      '<li>Comment on open proposals</li>' +
                      '</ol>'
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style >
</style>
