<template>
<section v-if="ghIssues">
  <b-container class="my-5">
    <b-row class="my-2 text-left text-small">
      <b-col sm="12" md="6">
        <div>
          <b-link @click="changeFilter('issues')" :class="(filter === 'issues') ? 'text-bold' : ''" class="pointer pr-3 mr-3 border-right" v-b-tooltip.hover="{ variant: 'dark' }" :title="'Open issues from GitHub'">SIP Suggestions ({{ghIssuesNumb}})</b-link>
          <b-link @click="changeFilter('pulls')" :class="(filter === 'pulls') ? 'text-bold' : ''" class="pointer mr-3" v-b-tooltip.hover="{ variant: 'dark' }" :title="'Open pull requests from GitHub'">SIP Proposals ({{ghPullsNumb}})</b-link>
        </div>
      </b-col>
      <b-col sm="12" md="6" class="text-right">
        <div>
          <!-- Type: <span class="pointer mr-3 pr-3" v-b-tooltip.hover="{ variant: 'dark' }" :title="'GitHub Open Issues'">OPEN</span> -->
          <b-dropdown size="sm" id="dropdown-1" right text="Status" variant="outline-info">
            <b-dropdown-item  v-for="(status, index) in statusNames" :key="index"  @click.prevent="toggleSearching(status)"><span class="text-small">{{status}}</span></b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-row>
    <b-row class="my-2 text-left">
      <b-col cols="12">
        <b-table striped hover :items="values()" :fields="fields()" class="text-small">
          <template #cell(Title)="data">
            <b-link class="text-info" variant="warning" v-on:click="openProposal(data)" v-html="data.value"></b-link>
          </template>
          <template #cell(Actions)="data">
            <b-link target="_blank" class="mr-2 text-info" variant="warning" :href="githubUrl(data)"><span v-b-tooltip.hover="{ variant: 'dark' }" :title="'View on GitHub'"><b-icon icon="arrow-up-right-square"/></span></b-link>
          </template>
          <template #cell(Labels)="data">
            <b-link class="mr-2 text-small" variant="warning">{{data.value}}</b-link>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</section>
<section v-else-if="!loaded && !ghIssues">
  <b-container class="my-5">No ghIssue found..</b-container>
</section>
<section v-else>
  <b-container class="my-5">Querying for issues..</b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import { DateTime } from 'luxon'

export default {
  name: 'SIPIssues',
  components: {
  },
  data () {
    return {
      statusNames: ['Any', 'Draft', 'Recommended', 'Question', 'Accepted', 'Activation-in-Progress', 'Stacks 2.1', 'Ready for CAB Review'],
      statusFilter: null,
      filter: 'issues',
      loaded: false
    }
  },
  mounted () {
    const filter = this.$route.query.filter
    if (filter && filter === 'pulls') this.filter = 'pulls'
  },
  methods: {
    toggleSearching (status) {
      if (status === 'Any') {
        this.statusFilter = null
        return
      }
      this.statusFilter = status.toLowerCase()
    },
    openProposal (data) {
      const issue = this.allGhIssues.find((o) => o.title === data.value)
      this.$router.push('/stxdao/sip-issue/' + issue.id)
    },
    changeFilter (filter) {
      this.filter = filter
    },
    githubUrl (data) {
      const issue = this.ghIssues[data.index]
      return issue.htmlUrl
    },
    fields () {
      return [
        {
          key: 'Title',
          sortable: true
        },
        {
          key: 'Labels',
          sortable: true
        },
        {
          key: 'Comments',
          sortable: true
        },
        {
          key: 'Date',
          sortable: true
        },
        {
          key: 'Actions'
        }
      ]
    },
    values () {
      const issues = this.ghIssues
      if (!issues) return []
      let mapped = []
      const $self = this
      mapped = issues.map(function (ghIssue) {
        return {
          Title: ghIssue.title, // '#' + ghIssue.number + ' ' + ghIssue.title,
          Labels: $self.labels(ghIssue.labels),
          Comments: ghIssue.comments.length,
          Date: (!ghIssue.createdAt) ? '' : DateTime.fromMillis(ghIssue.createdAt).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' }),
          Actions: ''
        }
      })
      return mapped
    },
    labels (labels) {
      if (!labels) return ''
      let labelNames = ''
      labels.forEach((label) => {
        labelNames += label.name
      })
      return labelNames
    }
  },
  computed: {
    allGhIssues () {
      const ghIssues = this.$store.getters[APP_CONSTANTS.KEY_SIP_ISSUES]
      return ghIssues
    },
    ghIssues () {
      let ghIssues = this.$store.getters[APP_CONSTANTS.KEY_SIP_ISSUES]
      if (!this.filter || this.filter === 'issues') {
        ghIssues = ghIssues.filter((o) => !o.pullRequest)
      } else if (this.filter === 'pulls') {
        ghIssues = ghIssues.filter((o) => o.pullRequest)
      }
      if (this.statusFilter) {
        ghIssues = ghIssues.filter((o) => (o.labels) ? o.labels[0].name.toLowerCase() === this.statusFilter : false)
      }
      return ghIssues
    },
    ghIssuesNumb () {
      return this.allGhIssues.filter((o) => !o.pullRequest).length
    },
    ghPullsNumb () {
      return this.allGhIssues.filter((o) => o.pullRequest).length
    }
  }
}
</script>
<style lang="scss">
</style>
