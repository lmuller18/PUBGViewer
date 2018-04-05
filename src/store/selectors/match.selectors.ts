import { createSelector } from "@ngrx/store";
import * as fromViewer from "../reducers";
import * as fromMatch from "../reducers/match.reducer";
import { getPlayer } from "../selectors/player.selectors";

export const getMatchState = createSelector(
  fromViewer.getViewerState,
  (state: fromViewer.ViewerState) => state.match
);

export const getRawMatches = createSelector(
  getMatchState,
  fromMatch.getRawMatches
);

export const getMatches = createSelector(
  getPlayer,
  getRawMatches,
  (player: any, rawMatches: any[]) => {
    const matches: any[] = [];
    rawMatches.forEach(rawMatch => {
      // get list of all participants
      const participantList: any[] = rawMatch.included.filter(element => {
        return element.type === "participant";
      });

      // get list of all rosters
      const rosterList: any[] = rawMatch.included.filter(element => {
        return element.type === "roster";
      });

      // get participant object of current user
      let playerParticipant = participantList.filter(participant => {
        return participant.attributes.stats.playerId === player.id;
      })[0];

      // format current player object
      playerParticipant = {
        stats: playerParticipant.attributes.stats,
        id: playerParticipant.id
      };

      // find roster that player belongs to
      const playerRoster = rosterList.find(roster => {
        let found = false;
        roster.relationships.participants.data.forEach(participant => {
          if (participant.id === playerParticipant.id) found = true;
        });
        return found;
      });

      // find and format participant objects of player's teammates
      const teammates: any[] = [];
      playerRoster.relationships.participants.data.forEach(participant => {
        const id = participant.id;
        let teammateParticipant = participantList.find(teammate => {
          return teammate.id === id;
        });

        teammates.push({
          stats: teammateParticipant.attributes.stats,
          id: teammateParticipant.id
        });
      });

      const team = {
        stats: {
          won: playerRoster.attributes.won == "true",
          rank: playerRoster.attributes.stats.rank,
          teamId: playerRoster.attributes.stats.teamId
        },
        teammates
      };

      let duration = new Date(null);
      duration.setSeconds(rawMatch.data.attributes.duration);
      let seconds = "";
      if (duration.getSeconds() < 10) {
        seconds = "0" + duration.getSeconds();
      }
      matches.push({
        gameMode: rawMatch.data.attributes.gameMode,
        duration: duration.getMinutes() + ":" + seconds,
        player: playerParticipant,
        team: team,
        included: rawMatch.included
      });
    });
    console.log("formatted matches: ", matches);
    return matches;
  }
);

export const getMatchesLoading = createSelector(
  getMatchState,
  fromMatch.getMatchesLoading
);

export const getMatchesLoaded = createSelector(
  getMatchState,
  fromMatch.getMatchesLoaded
);

export const getLoadedMatches = createSelector(
  getRawMatches,
  getMatchesLoaded,
  (matches: any[], loaded: boolean) => {
    if (loaded) return matches;
    return null;
  }
);
