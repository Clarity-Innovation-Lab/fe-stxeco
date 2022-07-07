import Vue from 'vue'
import VueRouter from 'vue-router'
import MainNavbar from '@/layout/MainNavbar.vue'
import SecondNavbar from '@/layout/SecondNavbar.vue'
import MainFooter from '@/layout/MainFooter.vue'
import Homepage from '@/views/Homepage.vue'
import Membership from '@/views/stxdao/membership/Membership.vue'
import Delegation from '@/views/stxdao/membership/Delegation.vue'
import ProposalContracts from '@/views/stxdao/proposals/ProposalContracts.vue'
import SIPLanding from '@/views/stxdao/github/SIPLanding.vue'
import SIPVoting from '@/views/stxdao/github/SIPVoting.vue'
import SIPCabs from '@/views/stxdao/github/SIPCabs.vue'
import SIPIssue from '@/views/stxdao/github/SIPIssue.vue'
import SIPIssues from '@/views/stxdao/github/SIPIssues.vue'
import SIPProcess from '@/views/stxdao/github/SIPProcess.vue'
// import SIPPullRequests from '@/views/stxdao/github/SIPPullRequests.vue'
import Proposals from '@/views/stxdao/proposals/Proposals.vue'
import Extensions from '@/views/stxdao/extensions/Extensions.vue'
import Proposal from '@/views/stxdao/proposals/Proposal.vue'
import CreateProposal from '@/views/stxdao/proposals/CreateProposal.vue'
import UpdateProposal from '@/views/stxdao/proposals/UpdateProposal.vue'
import SubmitProposal from '@/views/stxdao/proposals/SubmitProposal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Homepage for stx eco launcher' }
  },
  {
    path: '/coming-soon',
    name: 'coming-soon',
    components: { default: Homepage, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Ecosystem for stx eco' }
  },
  {
    path: '/stxdao/proposals/create',
    name: 'create-proposal',
    components: { default: CreateProposal, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Create Proposal for stx eco' }
  },
  {
    path: '/stxdao/contracts',
    name: 'contracts',
    components: { default: ProposalContracts, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Contracts for stx eco' }
  },
  {
    path: '/stxdao/delegation',
    name: 'delegation',
    components: { default: Delegation, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Delegation on stx eco' }
  },
  {
    path: '/stxdao/extensions',
    name: 'extensions',
    components: { default: Extensions, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Extensions for stx eco' }
  },
  {
    path: '/stxdao/proposals',
    name: 'proposals',
    components: { default: Proposals, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Proposals for stx eco' }
  },
  {
    path: '/stxdao/proposals/:proposalId',
    name: 'proposal',
    components: { default: Proposal, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Proposal for stx eco' }
  },
  {
    path: '/stxdao/proposals/update/:proposalId',
    name: 'update-proposal',
    components: { default: UpdateProposal, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Update Proposal for stx eco' }
  },
  {
    path: '/stxdao/proposals/submit/:proposalId',
    name: 'submit-proposal',
    components: { default: SubmitProposal, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Submit Proposal for stx eco' }
  },
  {
    path: '/stxdao/membership',
    name: 'membership',
    components: { default: Membership, daoheader: SecondNavbar, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Launcher for stx eco' }
  },
  {
    path: '/stxdao/sip-issue/:issueId',
    name: 'sip-issue',
    components: { default: SIPIssue, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPIssue for stx eco' }
  },
  {
    path: '/stxdao/sip-issues',
    name: 'sip-issues',
    components: { default: SIPIssues, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPIssues for stx eco' }
  },
  {
    path: '/stxdao/sip-voting',
    name: 'sip-voting',
    components: { default: SIPVoting, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPVoting for stx eco' }
  },
  {
    path: '/stxdao/sip-cabs',
    name: 'sip-cabs',
    components: { default: SIPCabs, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPCabs about CABs' }
  },
  {
    path: '/stxdao/sip-landing',
    name: 'sip-landing',
    components: { default: SIPLanding, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPIssues for stx eco' }
  },
  {
    path: '/stxdao/sip-process',
    name: 'sip-process',
    components: { default: SIPProcess, header: MainNavbar, footer: MainFooter },
    meta: { title: 'SIPProcess for stx eco' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (process.env.NETWORK === 'mainnet') {
    return next({ path: '/coming-soon', query: { redirect: to.fullPath } })
  } else {
    return next() // make sure to always call next()!
  }
})

export default router
