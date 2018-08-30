kubectl create ns $1 
status=$?
if [ $status -eq 0 ];
  then 
   echo command succeeded
  else 
   echo command failed
fi

echo status is $status