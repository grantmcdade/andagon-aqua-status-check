# Andagon Aqua status check action

This action checks the status of defects and requirements in Andagon's Aqua product.

## Inputs

## `branch_name`

**Required** The name of the branch. The branch name must contain the item code as DFxxxxxx or RQxxxxxx.

## `branch_name_expr`

**Required** The regular expression used to extract the item code from the branch name

## `aqua_url`

**Required** The HTTPS location of the aqua server

## `username`

**Required** The AQUA username to login with

## `password`

**Required** The password of the AQUA user

## `status_id_to_check`

**Required** The Id of the status code required for the action to succeed

## `status_not_set_message`

**Required** The text to show if the item **does not have** the specified status

## Outputs

## `item_code`

The complete item code

## `item_type`

The 2 character item type i.e. RQ or DF etc.

## `item_id`

The numeric item number (still as a string padded with 0''s)

## Example usage

    uses: grantmcdade/andagon-aqua-status-check@v1
    with:
      branch_name: '${{ github.head_ref }}'
      branch_name_expr: '(.*)\/.*'
      username: '<aqua_username>'
      password: '${{ secrets.AQUA_PASSWORD }}'
      aqua_url: '<aqua_url>'
      status_id_to_check: '20294'
      status_not_set_message: The item is not ready to merge
