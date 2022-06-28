import Vue from 'vue'
import VueRouter from 'vue-router'
import MainNavbar from '@/layout/MainNavbar.vue'
import MainFooter from '@/layout/MainFooter.vue'
import Homepage from '@/views/Homepage.vue'
import Membership from '@/views/stxdao/membership/Membership.vue'
import Delegation from '@/views/stxdao/membership/Delegation.vue'
import ProposalContracts from '@/views/stxdao/proposals/ProposalContracts.vue'
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
    components: { default: Homepage, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Ecosystem for stx eco' }
  },
  {
    path: '/stxdao/proposals/create',
    name: 'create-proposal',
    components: { default: CreateProposal, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Create Proposal for stx eco' }
  },
  {
    path: '/stxdao/contracts',
    name: 'contracts',
    components: { default: ProposalContracts, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Contracts for stx eco' }
  },
  {
    path: '/stxdao/delegation',
    name: 'delegation',
    components: { default: Delegation, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Delegation on stx eco' }
  },
  {
    path: '/stxdao/extensions',
    name: 'extensions',
    components: { default: Extensions, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Extensions for stx eco' }
  },
  {
    path: '/stxdao/proposals',
    name: 'proposals',
    components: { default: Proposals, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Proposals for stx eco' }
  },
  {
    path: '/stxdao/proposals/:proposalId',
    name: 'proposal',
    components: { default: Proposal, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Proposal for stx eco' }
  },
  {
    path: '/stxdao/proposals/update/:proposalId',
    name: 'update-proposal',
    components: { default: UpdateProposal, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Update Proposal for stx eco' }
  },
  {
    path: '/stxdao/proposals/submit/:proposalId',
    name: 'submit-proposal',
    components: { default: SubmitProposal, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Submit Proposal for stx eco' }
  },
  {
    path: '/stxdao/membership',
    name: 'membership',
    components: { default: Membership, header: MainNavbar, footer: MainFooter },
    meta: { title: 'Launcher for stx eco' }
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
