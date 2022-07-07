<template>
<section v-if="ghIssue">
  <b-container class="my-5">
    <div class="d-flex justify-content-between mb-5">
      <h4 class="text-small">{{issueType}}</h4>
      <div class="text-right text-xsmall">
        <b-link to="/stxdao/sip-issues"><b-icon icon="chevron-double-left"/>back</b-link>
        <b-link target="_blank" class="ml-4" :href="githubUrl"><span v-b-tooltip.hover="{ variant: 'dark' }" :title="'Leave Comments on GitHub'">comment <b-icon icon="arrow-up-right-square"/></span></b-link>
      </div>
    </div>
    <h2>
      <span v-b-tooltip.hover="{ variant: 'dark' }" :title="'View on GitHub'">
        <b-link :href="ghIssue.htmlUrl" target="_blank">{{ghIssue.title}}</b-link>
      </span>
    </h2>
    <div>
      <b-row class="py-3 my-4 border-bottom">
        <b-col cols="12" class="text-right">
          <div class="d-flex justify-content-between text-small">
            <div class="text-small">{{ghIssue.user.login}}</div>
            <div class="text-small">{{created}}</div>
          </div>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col>
          <vue-markdown :source="ghIssue.body"></vue-markdown>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col>
          <div class="sip-comment" v-for="(comment, index) in comments" :key="index">
            <div class="d-flex justify-content-between">
              <div>{{comment.user.login}}</div>
              <div>{{commentCreated(comment.createdAt)}}</div>
            </div>
            <vue-markdown class="sip-comment-body" :source="comment.body"></vue-markdown>
          </div>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col>
          <div>
            <b-link target="_blank" class="" :href="githubUrl"><span v-b-tooltip.hover="{ variant: 'dark' }" :title="'Leave Comments on GitHub'">Join the Conversation on GitHub <b-icon icon="arrow-up-right-square"/></span></b-link>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import VueMarkdown from 'vue-markdown'
import { DateTime } from 'luxon'

export default {
  name: 'SIPIssue',
  components: {
    VueMarkdown
  },
  data: function () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    commentCreated: function (createdAt) {
      return DateTime.fromMillis(createdAt).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }
  },
  computed: {
    githubUrl () {
      const issue = this.ghIssue
      return issue.htmlUrl
    },
    comments () {
      const comments = this.ghIssue.comments
      return comments
    },
    created: function () {
      return DateTime.fromMillis(this.ghIssue.createdAt).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    ghIssue () {
      const ghIssue = this.$store.getters[APP_CONSTANTS.KEY_SIP_ISSUE](Number(this.$route.params.issueId))
      return ghIssue
    },
    issueType () {
      return (this.ghIssue.pullRequest) ? 'SIP Candidate' : 'SIP Suggestion'
    }
  }
}
</script>

<style >
</style>
