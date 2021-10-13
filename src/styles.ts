export const styles = (theme: any) => {
  return {
    paper: {
      backgroundColor: theme.palette.background.paper
    },
    content: {
      backgroundColor: theme.palette.background.default
    },
    accordion: {
      width: '95%'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary
    }
  }
}
