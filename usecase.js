
                                            env_release
                                            Release candidate
master                                      |
      feature branch ----- (PullRequest)---- 
         env_feature---envDesriptor-helmchart
         env_prod



CI/CD
      master-> SpinUpEnv4Integration 
      master-> promote (start new release, attach chart)
